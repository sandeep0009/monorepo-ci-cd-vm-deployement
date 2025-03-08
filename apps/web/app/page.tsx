import {clientPrisma} from "db/db";

export default async function Home() {
  const users=await clientPrisma.user.findMany();
  return (
    <div>
    {JSON.stringify(users)}
  </div>
    

  );
}
