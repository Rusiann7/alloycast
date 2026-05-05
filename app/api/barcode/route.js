export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const upc = searchParams.get("upc");

  const res = await fetch(
    `https://api.upcitemdb.com/prod/trial/lookup?upc=${upc}`,
  );
  const data = await res.json();

  return Response.json(data);
}
