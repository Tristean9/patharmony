import Link from "next/link";

export default function Home() {
    return (
        <div>
            <h1></h1>
            <nav>
                <Link href={"/student"}>学生页面</Link>
                <Link href={"/guard"}>保安页面</Link>
                <Link href={"/admin"}>管理员页面</Link>
            </nav>
        </div>
    );
}
