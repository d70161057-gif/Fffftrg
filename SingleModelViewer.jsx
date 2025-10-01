import React, { useState, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stage, useGLTF } from '@react-three/drei'

function Model({ url }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} dispose={null} />
}

// preload helper
useGLTF.preload = (url) => url

export default function SingleModelViewer() {
  // default model served from public/models (Vite serves public/ at root)
  const defaultUrl = '/models/bugatti_la_voiture.glb'

  const [model, setModel] = useState({
    name: 'Bugatti — الموديل المرسل',
    url: defaultUrl,
    source: 'local (included)'
  })

  const [isInteracting, setIsInteracting] = useState(false)

  function handleUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setModel({ name: file.name, url, source: 'uploaded (temporary)' })
  }

  function handleInteractionStart() { setIsInteracting(true) }
  function handleInteractionEnd() { setTimeout(()=>setIsInteracting(false), 250) }

  return (
    <div style={{minHeight:'100vh',display:'flex',flexDirection:'column'}}>
      <header className="header">
        <div className="brand">3 mod</div>
      </header>

      <main className="container">
        <div className="card">
          <div className="viewer" id="viewer">
            <Canvas camera={{ position: [0, 1.2, 3], fov: 50 }}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[5,5,5]} intensity={0.8} />
              <Suspense fallback={null}>
                <Stage adjustCamera={false} intensity={0.9} environment="city">
                  <Model url={model.url} />
                </Stage>
              </Suspense>
              <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                enableDamping={true}
                dampingFactor={0.08}
                autoRotate={!isInteracting}
                autoRotateSpeed={0.25}
                onStart={handleInteractionStart}
                onEnd={handleInteractionEnd}
              />
            </Canvas>
          </div>

          <div className="controls">
            <div>
              <div className="meta">{model.name}</div>
              <div style={{fontSize:12,color:'#6b7280'}}>المصدر: {model.source}</div>
            </div>

            <div style={{display:'flex',gap:8,alignItems:'center'}}>
              <label className="btn" style={{cursor:'pointer'}}>
                رفع موديل (.glb/.gltf)
                <input onChange={handleUpload} type="file" accept=".glb,.gltf" style={{display:'none'}} />
              </label>
              <a className="btn" href={model.url} target="_blank" rel="noreferrer">فتح النموذج</a>
            </div>
          </div>
        </div>
      </main>

      <footer className="footer">الموديل مضمّن داخل المشروع: <strong>public/models/bugatti_la_voiture.glb</strong></footer>
    </div>
  )
}
