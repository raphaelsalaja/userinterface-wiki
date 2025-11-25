import { source } from "@markdown/lib/source";
import browserCollections from "@/.source/browser";

export const clientLoader = browserCollections.docs.createClientLoader({
  component(
    { default: MDX },
    _props: {
      myProp: string;
    },
  ) {
    return (
      <div>
        <MDX />
      </div>
    );
  },
});

export async function serverLoader(slugs: string[]) {
  return source.getPage(slugs)?.path;
}

export async function loader(slugs: string[]) {
  const path = await serverLoader(slugs);
  await clientLoader.preload(path);
  return { path };
}
