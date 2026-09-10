import * as THREE from 'three'

const GOLD = 0xd8b66a
const PALE_GOLD = 0xf1dfb4
const SHADOW = 0x15181e

function solarSigil() {
  const group = new THREE.Group()
  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.62, 2),
    new THREE.MeshStandardMaterial({ color: GOLD, roughness: 0.38, metalness: 0.5 }),
  )
  const cage = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.78, 1),
    new THREE.MeshBasicMaterial({ color: PALE_GOLD, wireframe: true, transparent: true, opacity: 0.42 }),
  )
  const orbit = new THREE.Mesh(
    new THREE.TorusGeometry(0.98, 0.018, 8, 80),
    new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0.75 }),
  )
  orbit.rotation.x = Math.PI / 2.7
  group.add(core, cage, orbit)
  return group
}

function lunarSigil() {
  const group = new THREE.Group()
  const moon = new THREE.Mesh(
    new THREE.SphereGeometry(0.72, 48, 32),
    new THREE.MeshStandardMaterial({ color: PALE_GOLD, roughness: 0.7, metalness: 0.12 }),
  )
  const shadow = new THREE.Mesh(
    new THREE.SphereGeometry(0.69, 48, 32),
    new THREE.MeshStandardMaterial({ color: SHADOW, roughness: 1 }),
  )
  shadow.position.set(0.38, 0.08, 0.28)
  const orbit = new THREE.Mesh(
    new THREE.TorusGeometry(0.98, 0.015, 8, 80),
    new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0.48 }),
  )
  orbit.rotation.x = Math.PI / 2.25
  group.add(moon, shadow, orbit)
  return group
}

export function mountRotatingSigil(container, kind) {
  try {
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    container.append(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100)
    camera.position.z = 4.3

    scene.add(new THREE.AmbientLight(0xffffff, 1.65))
    const keyLight = new THREE.DirectionalLight(0xffe5aa, 3)
    keyLight.position.set(2, 3, 4)
    scene.add(keyLight)

    const object = kind === 'lunar' ? lunarSigil() : solarSigil()
    scene.add(object)

    const resize = () => {
      const { width, height } = container.getBoundingClientRect()
      renderer.setSize(width, height, false)
      camera.aspect = width / Math.max(height, 1)
      camera.updateProjectionMatrix()
    }
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container)
    resize()

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let visible = true
    const visibilityObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting })
    visibilityObserver.observe(container)

    const startedAt = performance.now()
    const draw = () => {
      const elapsed = (performance.now() - startedAt) / 1000
      if (visible) {
        object.rotation.y = reducedMotion ? 0.35 : elapsed * 0.32
        object.rotation.z = reducedMotion ? -0.08 : Math.sin(elapsed * 0.38) * 0.12
        renderer.render(scene, camera)
      }
      requestAnimationFrame(draw)
    }
    draw()
  } catch {
    container.textContent = kind === 'lunar' ? '☾' : '☉'
    container.classList.add('sigil-stage--fallback')
  }
}
