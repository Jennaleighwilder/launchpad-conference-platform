import { NextRequest } from 'next/server';

/**
 * GET /api/events/swarm-status?id=<generation-id>
 * 
 * SSE endpoint that streams swarm agent progress in real-time.
 * The frontend connects to this while generation runs.
 * 
 * For MVP: returns mock progress since true SSE needs
 * a separate generation queue. The actual swarm runs
 * synchronously in the generate endpoint.
 */
export async function GET(_request: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const agents = ['branding', 'speakers', 'venue', 'schedule', 'pricing'];
      
      // Simulate agent progress
      for (let i = 0; i < agents.length; i++) {
        const data = JSON.stringify({
          total: 5,
          completed: i,
          current: agents[i],
          agents: agents.map((name, j) => ({
            name,
            status: j < i ? 'done' : j === i ? 'running' : 'pending',
          })),
        });
        
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        await new Promise(r => setTimeout(r, 800));
      }

      // Final
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ total: 5, completed: 5, done: true })}\n\n`));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
