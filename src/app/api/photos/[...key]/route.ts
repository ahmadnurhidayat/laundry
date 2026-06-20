import { getCloudflareContext } from '@opennextjs/cloudflare';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ key: string[] }> }
) {
  try {
    const { key } = await params;
    const { env } = getCloudflareContext();

    // Reconstruct the R2 key from the URL path
    const r2Key = key.join('/');

    const object = await env.R2.get(r2Key);

    if (!object) {
      return new Response('Not found', { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');

    return new Response(object.body, {
      headers,
    });
  } catch (error) {
    console.error('Error serving photo:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
