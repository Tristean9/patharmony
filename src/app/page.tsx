import { Card } from "antd";
import Link from "next/link";

export default function Home() {
    return (
        <div>
            <h1></h1>
            <nav>
                <Card>
                    <Link href={"/student"}>学生页面</Link>
                </Card>
                <Card>
                    <Link href={"/guard"}>保安页面</Link>
                </Card>
                <Card>
                    <Link href={"/admin"}>管理员页面</Link>
                </Card>
            </nav>
        </div>
    );
}
