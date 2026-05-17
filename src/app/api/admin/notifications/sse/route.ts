import { notificationEmitter } from '@/lib/events'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  let controllerRef: ReadableStreamDefaultController | null = null
  const encoder = new TextEncoder()

  // Define dynamic event callback inside request scope
  const onNewLead = (data: any) => {
    try {
      if (controllerRef) {
        const payload = `data: ${JSON.stringify(data)}\n\n`
        controllerRef.enqueue(encoder.encode(payload))
      }
    } catch (err) {
      console.error('❌ Failed to enqueue SSE event:', err)
    }
  }

  const stream = new ReadableStream({
    start(controller) {
      controllerRef = controller
      
      // Register event listener
      notificationEmitter.on('new-lead', onNewLead)

      // Send initial connect success handshake
      controller.enqueue(encoder.encode('retry: 5000\n: connected\n\n'))
    },
    cancel() {
      notificationEmitter.off('new-lead', onNewLead)
    }
  })

  // Heartbeat ping every 15 seconds to prevent client timeout
  const interval = setInterval(() => {
    try {
      if (controllerRef) {
        controllerRef.enqueue(encoder.encode(': heartbeat\n\n'))
      }
    } catch {
      notificationEmitter.off('new-lead', onNewLead)
      clearInterval(interval)
    }
  }, 15000)

  // Listen to connection close/abort signal
  request.signal.addEventListener('abort', () => {
    notificationEmitter.off('new-lead', onNewLead)
    clearInterval(interval)
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'Content-Encoding': 'none',
    }
  })
}
