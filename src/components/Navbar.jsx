import Link from "next/link";
import NavIcon from "./icons/NavbarIcon";
import { Button } from "./ui/button";

export default function Navbar() {
  return (
    <div className="flex">
        <NavIcon/>
        <h2 className="text-2xl font-bold tracking-tight">VoteWise</h2>

        <Link>Home</Link>
        <Link>Elections</Link>

        <Button>
            <Link>Login</Link>
        </Button>
        
      
    </div>
  );
}
