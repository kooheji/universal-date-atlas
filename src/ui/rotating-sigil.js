import * as THREE from 'three'


/*
  Universal Chronology Atlas
  Overview line-art sigils

  Gregorian:
  Armillary / solar-calendar instrument

  Bahrain Hijri:
  Stylized Medina mosque architecture

  These are deliberately schematic,
  monochrome line-art objects rather than
  literal architectural replicas.
*/


const GOLD = 0xd8b66a
const PALE_GOLD = 0xf1dfb4
const DIM_GOLD = 0x8f7948

function globeCoreMaterial() {
  const isLightTheme = document.documentElement.dataset.theme === 'light'
  return new THREE.MeshBasicMaterial({
    color: isLightTheme ? 0xf7f4ed : 0x13161b,
    transparent: isLightTheme,
    opacity: isLightTheme ? .78 : 1,
  })
}


/* ========================================
   MATERIAL HELPERS
======================================== */

function lineMaterial(
  color = PALE_GOLD,
  opacity = 0.8,
) {
  return new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity,
  })
}


const primaryLine =
  lineMaterial(
    PALE_GOLD,
    0.9,
  )


const secondaryLine =
  lineMaterial(
    GOLD,
    0.58,
  )


const faintLine =
  lineMaterial(
    DIM_GOLD,
    0.34,
  )


/* ========================================
   LINE GEOMETRY HELPERS
======================================== */

function lineFromPoints(
  points,
  material = primaryLine,
  loop = false,
) {
  const geometry =
    new THREE.BufferGeometry()
      .setFromPoints(points)

  if (loop) {
    return new THREE.LineLoop(
      geometry,
      material,
    )
  }

  return new THREE.Line(
    geometry,
    material,
  )
}


function horizontalRing(
  radius,
  y = 0,
  material = primaryLine,
  segments = 72,
) {
  const points = []

  for (
    let i = 0;
    i < segments;
    i += 1
  ) {
    const angle =
      (
        i /
        segments
      ) *
      Math.PI *
      2

    points.push(
      new THREE.Vector3(
        Math.cos(angle) *
          radius,

        y,

        Math.sin(angle) *
          radius,
      ),
    )
  }

  return lineFromPoints(
    points,
    material,
    true,
  )
}


function planarRing(
  radius,
  material = primaryLine,
  segments = 96,
) {
  const points = []

  for (
    let i = 0;
    i < segments;
    i += 1
  ) {
    const angle =
      (
        i /
        segments
      ) *
      Math.PI *
      2

    points.push(
      new THREE.Vector3(
        Math.cos(angle) *
          radius,

        Math.sin(angle) *
          radius,

        0,
      ),
    )
  }

  return lineFromPoints(
    points,
    material,
    true,
  )
}


function segment(
  start,
  end,
  material = primaryLine,
) {
  return lineFromPoints(
    [
      new THREE.Vector3(
        ...start,
      ),

      new THREE.Vector3(
        ...end,
      ),
    ],
    material,
  )
}


function boxOutline(
  width,
  height,
  depth,
  material = primaryLine,
) {
  const geometry =
    new THREE.BoxGeometry(
      width,
      height,
      depth,
    )

  const edges =
    new THREE.EdgesGeometry(
      geometry,
    )

  return new THREE.LineSegments(
    edges,
    material,
  )
}


/* ========================================
   MOON
   ROTATING LINE-ART GLOBE
======================================== */

function moonCrater(latitude, longitude, radius, material, surfaceRadius = 1.012) {
  const lat = THREE.MathUtils.degToRad(latitude)
  const lon = THREE.MathUtils.degToRad(longitude)
  const normal = new THREE.Vector3(
    Math.cos(lat) * Math.cos(lon),
    Math.sin(lat),
    Math.cos(lat) * Math.sin(lon),
  )
  const reference = Math.abs(normal.y) > .9
    ? new THREE.Vector3(1, 0, 0)
    : new THREE.Vector3(0, 1, 0)
  const tangent = new THREE.Vector3().crossVectors(normal, reference).normalize()
  const bitangent = new THREE.Vector3().crossVectors(normal, tangent).normalize()
  const points = []

  for (let index = 0; index < 48; index += 1) {
    const angle = index / 48 * Math.PI * 2
    points.push(
      normal.clone()
        .addScaledVector(tangent, Math.cos(angle) * radius)
        .addScaledVector(bitangent, Math.sin(angle) * radius * .78)
        .normalize()
        .multiplyScalar(surfaceRadius),
    )
  }

  return lineFromPoints(points, material, true)
}

function moonGlobeSigil() {
  const group = new THREE.Group()
  const outlineMaterial = lineMaterial(PALE_GOLD, .88)
  const gridMaterial = lineMaterial(GOLD, .25)
  const craterMaterial = lineMaterial(GOLD, .66)

  // A dark depth-writing core hides contours and craters on the far side.
  group.add(new THREE.Mesh(
    new THREE.SphereGeometry(.995, 48, 32),
    globeCoreMaterial(),
  ))

  group.add(planarRing(1.01, outlineMaterial, 128))

  ;[-60, -30, 0, 30, 60].forEach((latitude) => {
    const radians = THREE.MathUtils.degToRad(latitude)
    group.add(horizontalRing(Math.cos(radians) * 1.005, Math.sin(radians) * 1.005, gridMaterial, 96))
  })

  for (let index = 0; index < 8; index += 1) {
    const meridian = planarRing(1.005, gridMaterial, 128)
    meridian.rotation.y = index / 8 * Math.PI
    group.add(meridian)
  }

  const craters = [
    [18, 68, .19], [-16, 88, .12], [42, 112, .1], [-38, 128, .16],
    [7, 154, .08], [29, 190, .14], [-25, 218, .1], [52, 246, .08],
    [-47, 276, .13], [12, 308, .17], [36, 336, .09], [-8, 354, .07],
  ]

  craters.forEach(([latitude, longitude, radius], index) => {
    group.add(moonCrater(latitude, longitude, radius, craterMaterial))
    if (index % 3 === 0) {
      group.add(moonCrater(latitude + 1.5, longitude - 1.5, radius * .62, gridMaterial))
    }
  })

  group.rotation.x = -.12
  group.rotation.z = -.08
  return group
}


/* ========================================
   EARTH
   ROTATING LINE-ART GLOBE
======================================== */

function sphericalPath(coordinates, radius, material) {
  const points = coordinates.map(([latitude, longitude]) => {
    const lat = THREE.MathUtils.degToRad(latitude)
    const lon = THREE.MathUtils.degToRad(longitude)
    return new THREE.Vector3(
      Math.cos(lat) * Math.cos(lon),
      Math.sin(lat),
      Math.cos(lat) * Math.sin(lon),
    ).multiplyScalar(radius)
  })

  return lineFromPoints(points, material)
}

function earthGlobeSigil() {
  const group = new THREE.Group()
  const outlineMaterial = lineMaterial(PALE_GOLD, .82)
  const gridMaterial = lineMaterial(GOLD, .2)
  const landMaterial = lineMaterial(GOLD, .7)

  group.add(new THREE.Mesh(
    new THREE.SphereGeometry(.995, 48, 32),
    globeCoreMaterial(),
  ))
  group.add(planarRing(1.01, outlineMaterial, 128))

  ;[-60, -30, 0, 30, 60].forEach((latitude) => {
    const radians = THREE.MathUtils.degToRad(latitude)
    group.add(horizontalRing(Math.cos(radians), Math.sin(radians), gridMaterial, 96))
  })

  for (let index = 0; index < 8; index += 1) {
    const meridian = planarRing(1.002, gridMaterial, 128)
    meridian.rotation.y = index / 8 * Math.PI
    group.add(meridian)
  }

  // Simplified continental contours: enough geographic structure to read as
  // Earth while retaining the atlas's schematic line-art character.
  const landPaths = [
    [[70, -165], [58, -140], [50, -125], [32, -116], [18, -100], [8, -82], [22, -78], [40, -72], [55, -60], [68, -85], [70, -120], [70, -165]],
    [[13, -81], [4, -76], [-12, -70], [-28, -64], [-47, -70], [-55, -66], [-36, -52], [-10, -46], [5, -60], [13, -81]],
    [[72, -10], [58, 12], [46, 4], [36, -8], [18, -17], [5, 8], [-17, 18], [-35, 29], [-34, 43], [-8, 51], [12, 43], [31, 34], [42, 56], [55, 80], [66, 105], [72, 142], [52, 156], [34, 132], [22, 105], [8, 78], [25, 62], [40, 42], [56, 30], [72, -10]],
    [[-11, 113], [-22, 114], [-38, 126], [-44, 146], [-28, 154], [-14, 141], [-11, 113]],
    [[76, -52], [68, -28], [59, -38], [62, -58], [76, -52]],
  ]

  landPaths.forEach((path) => {
    group.add(sphericalPath(path, 1.012, landMaterial))
  })

  group.position.x = 1.05
  group.rotation.x = -.18
  group.rotation.z = -.12
  group.scale.setScalar(1.08)
  return group
}


/* ========================================
   SEASONS
   ANIMATED LINE-ART STORM CLOUD
======================================== */

function stormCloudSigil() {
  const group = new THREE.Group()
  const cloudMaterial = lineMaterial(PALE_GOLD, .72)
  const rainMaterial = lineMaterial(GOLD, .34)
  const lightningMaterial = lineMaterial(PALE_GOLD, .95)
  const secondaryLightningMaterial = lineMaterial(GOLD, .62)

  const cloudCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.34, .02, 0),
    new THREE.Vector3(-1.24, .42, 0),
    new THREE.Vector3(-.88, .58, 0),
    new THREE.Vector3(-.56, .5, 0),
    new THREE.Vector3(-.27, .88, 0),
    new THREE.Vector3(.28, .94, 0),
    new THREE.Vector3(.64, .62, 0),
    new THREE.Vector3(1.02, .58, 0),
    new THREE.Vector3(1.3, .3, 0),
    new THREE.Vector3(1.24, -.02, 0),
    new THREE.Vector3(.82, -.17, 0),
    new THREE.Vector3(-.94, -.17, 0),
    new THREE.Vector3(-1.34, .02, 0),
  ], true, 'catmullrom', .42)

  group.add(lineFromPoints(cloudCurve.getPoints(140), cloudMaterial, true))
  group.add(segment([-.82, -.42, 0], [-.98, -.82, 0], rainMaterial))
  group.add(segment([.82, -.42, 0], [.66, -.82, 0], rainMaterial))

  const mainBolt = lineFromPoints([
    new THREE.Vector3(.08, -.2, .02),
    new THREE.Vector3(-.22, -.77, .02),
    new THREE.Vector3(.08, -.72, .02),
    new THREE.Vector3(-.08, -1.3, .02),
    new THREE.Vector3(.52, -.55, .02),
    new THREE.Vector3(.19, -.59, .02),
    new THREE.Vector3(.42, -.2, .02),
  ], lightningMaterial)
  const sideBolt = lineFromPoints([
    new THREE.Vector3(-.46, -.2, .02),
    new THREE.Vector3(-.65, -.62, .02),
    new THREE.Vector3(-.43, -.57, .02),
    new THREE.Vector3(-.62, -.98, .02),
  ], secondaryLightningMaterial)

  group.add(mainBolt, sideBolt)
  group.position.set(1.0, .08, 0)
  group.scale.setScalar(.88)
  group.userData.lightningMaterials = [lightningMaterial, secondaryLightningMaterial]
  group.userData.baseY = group.position.y
  return group
}


/* ========================================
   SUN
   OSCILLATING LINE-ART SURFACE
======================================== */

function sunSurfaceSigil() {
  const uniforms = {
    uTime: { value: 0 },
    uAspect: { value: 1 },
  }

  const material = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    vertexShader: `
      varying vec2 vUv;

      void main() {
        vUv = uv;
        gl_Position = vec4(position.xy, 0.0, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;

      uniform float uTime;
      uniform float uAspect;
      varying vec2 vUv;

      float hash(vec2 point) {
        return fract(sin(dot(point, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 point) {
        vec2 cell = floor(point);
        vec2 fraction = fract(point);
        fraction = fraction * fraction * (3.0 - 2.0 * fraction);

        return mix(
          mix(hash(cell), hash(cell + vec2(1.0, 0.0)), fraction.x),
          mix(hash(cell + vec2(0.0, 1.0)), hash(cell + 1.0), fraction.x),
          fraction.y
        );
      }

      float fbm(vec2 point) {
        float value = 0.0;
        float amplitude = 0.52;

        for (int octave = 0; octave < 6; octave += 1) {
          value += amplitude * noise(point);
          point = mat2(1.62, 1.18, -1.18, 1.62) * point;
          amplitude *= 0.48;
        }

        return value;
      }

      void main() {
        vec2 point = vUv - 0.5;
        point.x *= uAspect;

        // Scale the Sun to nearly the full card width, then lower its centre so
        // it reads as a large surface rising from the bottom of the card.
        float sunRadius = max(0.405, uAspect * 0.48);
        vec2 sunCenter = vec2(0.0, -sunRadius * 0.64);
        float signedDistance = length(point - sunCenter) - sunRadius;
        float surfaceMask = smoothstep(0.008, -0.008, signedDistance);
        float rim = 1.0 - smoothstep(0.004, 0.014, abs(signedDistance));

        // Two scale-matched noise fields crossfade once per octave. The
        // pattern can therefore move inward forever without a visible jump.
        float zoomPhase = fract(uTime * 0.075);
        float zoom = exp2(zoomPhase);
        vec2 domain = (point - sunCenter) * 12.0 * zoom;
        float fieldNear = fbm(domain);
        float fieldFar = fbm(domain * 0.5);
        float field = mix(fieldNear, fieldFar, zoomPhase);

        // Draw changing isolines instead of a coloured, photographic surface.
        // The second field adds finer structure without creating a solid fill.
        float contour = pow(1.0 - abs(sin(field * 27.0)), 13.0);
        float fineContour = pow(1.0 - abs(sin(fbm(domain * 1.8) * 35.0)), 18.0);
        float textureLines = max(contour * 0.42, fineContour * 0.22);

        // A few restrained latitude-like arcs help the form read as a globe.
        float arcField = point.y + (field - 0.5) * 0.032;
        float arcs = pow(1.0 - abs(sin(arcField * 42.0)), 22.0) * 0.18;

        vec3 lineColor = vec3(0.72, 0.62, 0.39);
        float alpha = rim * 0.72 + surfaceMask * max(textureLines, arcs);

        gl_FragColor = vec4(lineColor, alpha);
      }
    `,
  })

  const surface = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    material,
  )

  surface.userData.timeUniform = uniforms.uTime
  surface.userData.aspectUniform = uniforms.uAspect
  return surface
}


/* ========================================
   GREGORIAN
   ARMILLARY / CALENDAR INSTRUMENT
======================================== */

function gregorianArmillarySigil() {
  const group =
    new THREE.Group()


  /*
    Central polyhedral core.

    It remains transparent:
    only the actual edges are drawn.
  */

  const coreGeometry =
    new THREE.IcosahedronGeometry(
      0.47,
      1,
    )


  const coreEdges =
    new THREE.EdgesGeometry(
      coreGeometry,
      18,
    )


  const core =
    new THREE.LineSegments(
      coreEdges,
      faintLine,
    )


  group.add(core)


  /*
    Equatorial ring
  */

  const equator =
    planarRing(
      0.82,
      primaryLine,
    )

  equator.rotation.x =
    Math.PI / 2

  group.add(equator)


  /*
    Meridian
  */

  const meridian =
    planarRing(
      0.82,
      secondaryLine,
    )

  meridian.rotation.y =
    Math.PI / 2

  group.add(meridian)


  /*
    Second meridian
  */

  const meridianTwo =
    planarRing(
      0.82,
      faintLine,
    )

  meridianTwo.rotation.y =
    Math.PI / 2

  meridianTwo.rotation.z =
    Math.PI / 3

  group.add(
    meridianTwo,
  )


  /*
    Ecliptic-style tilted ring.
  */

  const ecliptic =
    planarRing(
      0.97,
      primaryLine,
    )

  ecliptic.rotation.x =
    Math.PI / 2.6

  ecliptic.rotation.y =
    Math.PI / 5

  group.add(ecliptic)


  /*
    Outer chronological ring.
  */

  const outer =
    planarRing(
      1.08,
      faintLine,
    )

  outer.rotation.x =
    Math.PI / 2

  outer.rotation.z =
    Math.PI / 8

  group.add(outer)


  /*
    North/south axis.
  */

  group.add(
    segment(
      [
        0,
        -1.05,
        0,
      ],
      [
        0,
        1.05,
        0,
      ],
      secondaryLine,
    ),
  )


  /*
    Axis terminals.
  */

  group.add(
    horizontalRing(
      0.055,
      1.05,
      primaryLine,
      24,
    ),
  )


  group.add(
    horizontalRing(
      0.055,
      -1.05,
      primaryLine,
      24,
    ),
  )


  /*
    Four small calendar reference ticks
    around the equatorial ring.
  */

  const tickRadius =
    0.82

  for (
    let i = 0;
    i < 4;
    i += 1
  ) {
    const angle =
      (
        i /
        4
      ) *
      Math.PI *
      2


    const x =
      Math.cos(angle) *
      tickRadius


    const z =
      Math.sin(angle) *
      tickRadius


    group.add(
      segment(
        [
          x * 0.94,
          -0.045,
          z * 0.94,
        ],
        [
          x * 1.08,
          0.045,
          z * 1.08,
        ],
        primaryLine,
      ),
    )
  }


  /*
    Slight tilt makes the instrument
    immediately read as three-dimensional.
  */

  group.rotation.x =
    -0.12

  group.rotation.z =
    -0.08


  return group
}


/* ========================================
   MOSQUE GEOMETRY HELPERS
======================================== */

function dome(
  radius,
  baseY,
) {
  const group =
    new THREE.Group()


  /*
    Horizontal latitude rings.
  */

  const latitudes = [
    0,
    0.26,
    0.5,
    0.72,
  ]


  latitudes.forEach(
    (
      fraction,
      index,
    ) => {

      const theta =
        fraction *
        Math.PI /
        2


      const ringRadius =
        radius *
        Math.cos(theta)


      const y =
        baseY +
        radius *
        Math.sin(theta)


      group.add(
        horizontalRing(
          ringRadius,
          y,
          index === 0
            ? primaryLine
            : faintLine,
          48,
        ),
      )

    },
  )


  /*
    Meridian arcs create the dome's
    actual three-dimensional curvature.
  */

  const meridians =
    8


  for (
    let i = 0;
    i < meridians;
    i += 1
  ) {

    const phi =
      (
        i /
        meridians
      ) *
      Math.PI *
      2


    const points = []


    const steps =
      20


    for (
      let step = 0;
      step <= steps;
      step += 1
    ) {

      const theta =
        (
          step /
          steps
        ) *
        Math.PI /
        2


      const horizontal =
        radius *
        Math.cos(theta)


      points.push(
        new THREE.Vector3(

          horizontal *
            Math.cos(phi),

          baseY +
            radius *
            Math.sin(theta),

          horizontal *
            Math.sin(phi),

        ),
      )

    }


    group.add(
      lineFromPoints(
        points,
        faintLine,
      ),
    )

  }


  return group
}


function minaret(
  x,
  z = 0,
) {
  const group =
    new THREE.Group()


  const shaftBottom =
    -0.52


  const shaftTop =
    0.58


  const radius =
    0.095


  /*
    Main shaft rings.
  */

  const bottomRing =
    horizontalRing(
      radius,
      shaftBottom,
      secondaryLine,
      24,
    )


  const middleRing =
    horizontalRing(
      radius,
      0.18,
      faintLine,
      24,
    )


  const upperRing =
    horizontalRing(
      radius,
      shaftTop,
      primaryLine,
      24,
    )


  group.add(
    bottomRing,
    middleRing,
    upperRing,
  )


  /*
    Four vertical structural lines.
  */

  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ]


  directions.forEach(
    ([dx, dz]) => {

      group.add(
        segment(
          [
            dx * radius,
            shaftBottom,
            dz * radius,
          ],
          [
            dx * radius,
            shaftTop,
            dz * radius,
          ],
          faintLine,
        ),
      )

    },
  )


  /*
    Balcony.
  */

  group.add(
    horizontalRing(
      0.145,
      0.34,
      primaryLine,
      32,
    ),
  )


  group.add(
    horizontalRing(
      0.12,
      0.29,
      secondaryLine,
      32,
    ),
  )


  /*
    Spire.
  */

  const spireBaseY =
    shaftTop


  const apexY =
    0.94


  const spireRadius =
    0.11


  group.add(
    horizontalRing(
      spireRadius,
      spireBaseY,
      primaryLine,
      24,
    ),
  )


  directions.forEach(
    ([dx, dz]) => {

      group.add(
        segment(
          [
            dx * spireRadius,
            spireBaseY,
            dz * spireRadius,
          ],
          [
            0,
            apexY,
            0,
          ],
          secondaryLine,
        ),
      )

    },
  )


  /*
    Finial.
  */

  group.add(
    segment(
      [
        0,
        apexY,
        0,
      ],
      [
        0,
        1.07,
        0,
      ],
      primaryLine,
    ),
  )


  group.position.set(
    x,
    0,
    z,
  )


  return group
}


/* ========================================
   HIJRI
   MEDINA MOSQUE MOTIF
======================================== */

function hijriMedinaSigil() {
  const group =
    new THREE.Group()


  /*
    Mosque base/platform.
  */

  const platform =
    boxOutline(
      1.72,
      0.11,
      0.78,
      faintLine,
    )

  platform.position.y =
    -0.6

  group.add(platform)


  /*
    Main prayer-hall mass.
  */

  const building =
    boxOutline(
      1.36,
      0.48,
      0.64,
      secondaryLine,
    )

  building.position.y =
    -0.31

  group.add(building)


  /*
    Central dome drum.
  */

  const drumBottom =
    horizontalRing(
      0.36,
      -0.05,
      primaryLine,
      48,
    )


  const drumTop =
    horizontalRing(
      0.36,
      0.08,
      primaryLine,
      48,
    )


  group.add(
    drumBottom,
    drumTop,
  )


  /*
    Drum verticals.
  */

  for (
    let i = 0;
    i < 8;
    i += 1
  ) {

    const angle =
      (
        i /
        8
      ) *
      Math.PI *
      2


    const x =
      Math.cos(angle) *
      0.36


    const z =
      Math.sin(angle) *
      0.36


    group.add(
      segment(
        [
          x,
          -0.05,
          z,
        ],
        [
          x,
          0.08,
          z,
        ],
        faintLine,
      ),
    )
  }


  /*
    Medina-inspired central dome.
  */

  group.add(
    dome(
      0.43,
      0.08,
    ),
  )


  /*
    Dome finial.
  */

  group.add(
    segment(
      [
        0,
        0.51,
        0,
      ],
      [
        0,
        0.72,
        0,
      ],
      primaryLine,
    ),
  )


  group.add(
    horizontalRing(
      0.045,
      0.72,
      primaryLine,
      20,
    ),
  )


  /*
    Twin minarets give the object a
    recognizable mosque silhouette.
  */

  group.add(
    minaret(
      -0.69,
      0,
    ),
  )


  group.add(
    minaret(
      0.69,
      0,
    ),
  )


  /*
    Repeating front arches.

    These are intentionally schematic,
    not a literal architectural survey.
  */

  const archXs = [
    -0.42,
    -0.14,
    0.14,
    0.42,
  ]


  archXs.forEach(
    (x) => {

      const points = []

      const radius =
        0.095


      const baseY =
        -0.48


      const centerY =
        -0.29


      /*
        Left upright.
      */

      points.push(
        new THREE.Vector3(
          x - radius,
          baseY,
          0.326,
        ),
      )


      points.push(
        new THREE.Vector3(
          x - radius,
          centerY,
          0.326,
        ),
      )


      /*
        Semi-circular arch.
      */

      for (
        let step = 0;
        step <= 16;
        step += 1
      ) {

        const angle =
          Math.PI -
          (
            step /
            16
          ) *
          Math.PI


        points.push(
          new THREE.Vector3(

            x +
              Math.cos(angle) *
              radius,

            centerY +
              Math.sin(angle) *
              radius,

            0.326,

          ),
        )

      }


      /*
        Right upright.
      */

      points.push(
        new THREE.Vector3(
          x + radius,
          baseY,
          0.326,
        ),
      )


      group.add(
        lineFromPoints(
          points,
          faintLine,
        ),
      )

    },
  )


  /*
    A restrained lunar orbital arc gives
    it a chronology/astronomy connection
    without turning it into a generic
    crescent icon.
  */

  const orbit =
    planarRing(
      1.02,
      faintLine,
      96,
    )

  orbit.rotation.x =
    Math.PI / 2.5

  orbit.rotation.y =
    Math.PI / 8

  group.add(orbit)


  /*
    Scale/tilt for the overview card.
  */

  group.scale.setScalar(
    0.93,
  )


  group.rotation.x =
    -0.08


  return group
}


/* ========================================
   PUBLIC MOUNT FUNCTION
======================================== */

export function mountRotatingSigil(
  container,
  kind,
) {
  try {

    const renderer =
      new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
      })


    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio,
        2,
      ),
    )


    renderer.setClearColor(
      0x000000,
      0,
    )


    renderer.outputColorSpace =
      THREE.SRGBColorSpace


    container.append(
      renderer.domElement,
    )


    const scene =
      new THREE.Scene()


    const camera =
      new THREE.PerspectiveCamera(
        32,
        1,
        0.1,
        100,
      )


    /*
      Slightly farther than before because
      the Medina silhouette is taller.
    */

    camera.position.set(
      0,
      0,
      4.65,
    )


    let object


    if (kind === 'sun-surface') {

      object =
        sunSurfaceSigil()

    } else if (kind === 'moon-globe') {

      object =
        moonGlobeSigil()

    } else if (kind === 'earth-globe') {

      object =
        earthGlobeSigil()

    } else if (kind === 'storm-cloud') {

      object =
        stormCloudSigil()

    } else if (
      kind === 'hijri-medina' ||
      kind === 'lunar'
    ) {

      object =
        hijriMedinaSigil()

    } else {

      object =
        gregorianArmillarySigil()

    }


    scene.add(object)


    const resize = () => {

      const {
        width,
        height,
      } =
        container
          .getBoundingClientRect()


      renderer.setSize(
        width,
        height,
        false,
      )


      camera.aspect =
        width /
        Math.max(
          height,
          1,
        )


      camera
        .updateProjectionMatrix()

      if (object.userData.aspectUniform) {
        object.userData.aspectUniform.value = width / Math.max(height, 1)
      }

    }


    const resizeObserver =
      new ResizeObserver(
        resize,
      )


    resizeObserver.observe(
      container,
    )


    resize()


    const reducedMotion =
      window
        .matchMedia(
          '(prefers-reduced-motion: reduce)',
        )
        .matches


    let visible =
      true


    const visibilityObserver =
      new IntersectionObserver(
        ([entry]) => {

          visible =
            entry.isIntersecting

        },
      )


    visibilityObserver.observe(
      container,
    )


    const startedAt =
      performance.now()


    let frameId
    let disposed = false


    const draw = () => {

      if (disposed) return

      const elapsed =
        (
          performance.now() -
          startedAt
        ) /
        1000


      if (visible) {

        if (kind === 'sun-surface') {

          object.userData.timeUniform.value = reducedMotion ? 0 : elapsed

        } else if (kind === 'storm-cloud') {

          const cycle = reducedMotion ? 1 : elapsed % 5.6
          const flash = cycle < .12
            ? 1
            : cycle > .2 && cycle < .29
              ? .72
              : .13

          object.userData.lightningMaterials[0].opacity = flash
          object.userData.lightningMaterials[1].opacity = flash * .66
          object.position.y = object.userData.baseY + (reducedMotion ? 0 : Math.sin(elapsed * .55) * .025)

        } else if (reducedMotion) {

          object.rotation.y =
            0.42

        } else {

          /*
            Slow museum-display rotation.

            Deliberately slower than the
            previous solid objects.
          */

          object.rotation.y =
            elapsed *
            0.19


          object.rotation.z =
            Math.sin(
              elapsed *
              0.22,
            ) *
            0.025

        }


        renderer.render(
          scene,
          camera,
        )

      }


      frameId = requestAnimationFrame(
        draw,
      )

    }


    draw()


    return () => {
      disposed = true
      cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
      scene.traverse((item) => {
        item.geometry?.dispose?.()
        if (Array.isArray(item.material)) {
          item.material.forEach((material) => {
            material.map?.dispose?.()
            material.dispose?.()
          })
        } else {
          item.material?.map?.dispose?.()
          item.material?.dispose?.()
        }
      })
      renderer.dispose()
      renderer.domElement.remove()
    }

  } catch {

    const lunar =
      kind === 'moon-globe' ||
      kind ===
        'hijri-medina' ||
      kind ===
        'lunar'

    const earth = kind === 'earth-globe'
    const storm = kind === 'storm-cloud'


    container.textContent =
      kind === 'sun-surface'
        ? '☉'
        : earth
        ? '⊕'
        : storm
        ? '☁'
        : lunar
        ? '☾'
        : '◉'


    container.classList.add(
      'sigil-stage--fallback',
    )

    return () => {}

  }
}
