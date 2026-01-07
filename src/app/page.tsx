import Header from "@/components/header";
import Link from "next/link";

type Article = {
  id: string;
  title: string;
  slug: string;
  createdAt: string;
  author: { username: string };
  tags: { tag: { name: string } }[];
};



export default async function HomePage() {


  return (
    <>
      <Header />
    </>
  );
}
