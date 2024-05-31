import { getOddsApiDocs } from "@/lib/swagger"
import ReactSwagger from "./client";

export default async function IndexPage() {
  const spec = await getOddsApiDocs();
  return (
    <section className="container">
      <ReactSwagger spec={spec} />
    </section>
  );
}