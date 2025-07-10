import './components.css'
import { FaLink } from "react-icons/fa";

export default function Footer() {
  return (
    <footer
     className="footer text-sm px-4 py-3 mb-1 flex justify-between items-center">
      <a href="/privacy-policy"
       className="hover:underline"
       >
        Privacy Policy
      </a>
      <span className='flex items-center gap-1'><FaLink/> by derrick</span>
    </footer>
  );
}
