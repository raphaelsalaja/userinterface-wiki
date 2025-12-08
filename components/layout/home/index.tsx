import Link from "next/link";
import { source } from "@/markdown/lib/source";

export const HomeLayout = () => {
  console.log(source.getPages());

  return (
    <div>
      <h1>userinterface.wiki</h1>
      <ul>
        {source.getPages().map((page) => {
          const {
            title,
            author,
            date: { published },
          } = page.data;

          return (
            <li key={page.url}>
              <Link href={page.url}>
                <span>{title}</span>
                <div>
                  <span>{author}</span>
                  <span>{published}</span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
