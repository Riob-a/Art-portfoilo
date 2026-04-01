import { FaLink } from "react-icons/fa";
import { usePathname } from "next/navigation";

export default function Footer() {
   const pathname = usePathname();
  
    if (pathname === "/gallery") return null;

  return (
    <footer
     className="footer text-xs px-4 py-3  flex justify-between items-center ">
      <p
       className="hover:underline"
       >
        Portfolio
      </p>
      <span className='flex items-center gap-1'><a className='flex items-center gap-1' href="https://portfolio-five-five.vercel.app/"><FaLink/> by derrick</a></span>
    </footer>
  );
}
