import Link from "next/link"
import notFoundImage from './img/404.png';
import './not-found.css';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="text-center max-w-md">
        <img src={notFoundImage.src} alt="404 Not Found" className="image" />
        <h2 className="text-3xl font-semibold text-gray-700 mt-4">Page Not Found</h2>
        <p className="mt-6 text-gray-600">
          Oops! The page you're looking for doesn't exist. 
        </p>
        <button className="mt-8 bg-blue-500 hover:bg-blue-700 text-white px-6 py-2 rounded goBackBtn">
          <Link href="https://www.efflux.ai/home">Go Back Home</Link>
        </button>
      </div>
    </div>
  )
}