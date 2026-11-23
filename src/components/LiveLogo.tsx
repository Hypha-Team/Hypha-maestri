/*
  The logo, alive: when the pointer (or a finger) moves over it,
  the red threads bend around it like fabric pushed by a hand, ripple softly,
  and get dragged a little in the direction you move. They settle back when you leave.

  Made with a tiny WebGL shader on top of /logo.jpg. If WebGL is missing or the person
  prefers reduced motion, the normal image is shown instead.
  Tune the feel with the numbers in FEEL.
*/
import { useEffect, useRef, useState } from 'react'
import { lowPower, reducedMotion } from '../motion/motion'

/** The logo works both at the site root and under /hypha/ on GitHub Pages. */
const LOGO = `${import.meta.env.BASE_URL}logo.jpg`

const FEEL = {
  radius: 0.2, // size of the area that reacts (share of the panel height)
  lens: 0.32, // how much the threads bulge away from the pointer
  drag: 2.2, // how much the threads follow the pointer's movement
  ripple: 0.004, // small waves running through the threads
  follow: 0.14, // how quickly the effect catches up with the pointer (0–1)
}

const VERT = `
attribute vec2 a;
varying vec2 vUv;
void main() { vUv = a * 0.5 + 0.5; gl_Position = vec4(a, 0.0, 1.0); }`

const FRAG = `
precision mediump float;
varying vec2 vUv;
uniform sampler2D img;
uniform vec2 mouse;     // pointer, 0..1 in the panel
uniform vec2 vel;       // pointer speed
uniform float strength; // 0 = calm, 1 = full effect
uniform float aspect;   // panel width / height
uniform vec2 cover;     // part of the image visible (object-fit: cover)
uniform float time;
uniform float radius;
uniform float lens;
uniform float drag;
uniform float ripple;
void main() {
  vec2 p = vUv;
  vec2 diff = (p - mouse) * vec2(aspect, 1.0);
  float d = length(diff);
  float fall = exp(-(d * d) / (radius * radius)) * strength;
  p -= (p - mouse) * fall * lens;                       // bulge
  p -= vel * fall * drag;                               // drag along
  vec2 dir = diff / max(d, 0.0001) / vec2(aspect, 1.0);
  p += dir * sin(d * 70.0 - time * 7.0) * ripple * fall; // ripple
  vec2 uv = (p - 0.5) * cover + 0.5;
  gl_FragColor = texture2D(img, clamp(uv, 0.0, 1.0));
}`

export default function LiveLogo({ alt, className = '' }: { alt: string; className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const [fallback, setFallback] = useState(() => reducedMotion())

  useEffect(() => {
    if (fallback) return
    const c = canvas.current!
    const light = lowPower() // phones: fewer pixels to redraw, no antialiasing
    const gl = c.getContext('webgl', { premultipliedAlpha: false, antialias: !light, powerPreference: 'low-power' })
    if (!gl) { console.warn('LiveLogo: no WebGL'); return setFallback(true) }

    const shader = (type: number, src: string) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.warn('LiveLogo:', gl.getShaderInfoLog(s))
      return s
    }
    const prog = gl.createProgram()!
    gl.attachShader(prog, shader(gl.VERTEX_SHADER, VERT))
    gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn('LiveLogo: shader failed', gl.getProgramInfoLog(prog))
      return setFallback(true)
    }
    gl.useProgram(prog)

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const a = gl.getAttribLocation(prog, 'a')
    gl.enableVertexAttribArray(a)
    gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0)

    const u = (n: string) => gl.getUniformLocation(prog, n)
    gl.uniform1f(u('radius'), FEEL.radius)
    gl.uniform1f(u('lens'), FEEL.lens)
    gl.uniform1f(u('drag'), FEEL.drag)
    gl.uniform1f(u('ripple'), FEEL.ripple)

    let imgAspect = 1
    let ready = false
    const tex = gl.createTexture()
    const image = new Image()
    image.onload = () => {
      imgAspect = image.width / image.height
      gl.bindTexture(gl.TEXTURE_2D, tex)
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      ready = true
      resize()
    }
    image.onerror = () => { console.warn('LiveLogo: image failed'); setFallback(true) }
    image.src = LOGO

    // pointer state, smoothed
    const target = { x: 0.5, y: 0.5 }
    const pos = { x: 0.5, y: 0.5 }
    const v = { x: 0, y: 0 }
    let goal = 0 // 1 while the pointer is over the logo
    let strength = 0
    let raf = 0
    const start = performance.now()

    const draw = () => {
      if (!ready) return
      const boxAspect = c.width / c.height
      const cover = boxAspect > imgAspect ? [1, imgAspect / boxAspect] : [boxAspect / imgAspect, 1]
      gl.viewport(0, 0, c.width, c.height)
      gl.uniform2f(u('mouse'), pos.x, pos.y)
      gl.uniform2f(u('vel'), v.x, v.y)
      gl.uniform1f(u('strength'), strength)
      gl.uniform1f(u('aspect'), boxAspect)
      gl.uniform2f(u('cover'), cover[0], cover[1])
      gl.uniform1f(u('time'), (performance.now() - start) / 1000)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }

    // Animate only while something is moving, then rest.
    const tick = () => {
      const px = pos.x
      const py = pos.y
      pos.x += (target.x - pos.x) * FEEL.follow
      pos.y += (target.y - pos.y) * FEEL.follow
      v.x = v.x * 0.85 + (pos.x - px) * 0.15
      v.y = v.y * 0.85 + (pos.y - py) * 0.15
      strength += (goal - strength) * 0.08
      draw()
      const moving = Math.abs(goal - strength) > 0.002 || Math.abs(v.x) + Math.abs(v.y) > 0.00005 || goal > 0
      raf = moving ? requestAnimationFrame(tick) : 0
    }
    const wake = () => { if (!raf) raf = requestAnimationFrame(tick) }

    const resize = () => {
      const r = c.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, light ? 1.5 : 2)
      c.width = Math.max(1, Math.round(r.width * dpr))
      c.height = Math.max(1, Math.round(r.height * dpr))
      draw()
    }
    const ro = new ResizeObserver(resize)
    ro.observe(c)

    const move = (e: PointerEvent) => {
      const r = c.getBoundingClientRect()
      target.x = (e.clientX - r.left) / r.width
      target.y = 1 - (e.clientY - r.top) / r.height
      if (goal === 0) { pos.x = target.x; pos.y = target.y } // start where the pointer enters
      goal = 1
      wake()
    }
    const leave = () => { goal = 0; wake() }
    c.addEventListener('pointermove', move)
    c.addEventListener('pointerdown', move)
    c.addEventListener('pointerleave', leave)
    c.addEventListener('pointerup', (e) => { if (e.pointerType !== 'mouse') leave() })
    c.addEventListener('pointercancel', leave)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [fallback])

  if (fallback) return <img src={LOGO} alt={alt} className={`h-full w-full object-cover ${className}`} />
  return <canvas ref={canvas} role="img" aria-label={alt} className={`block h-full w-full touch-pan-y ${className}`} />
}
