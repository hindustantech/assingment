// src/components/layout/Footer.tsx
const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-6 mt-10">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left space-y-3 sm:space-y-0">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} <span className="font-semibold text-white">Enterprise Task Manager</span>. All rights reserved.
        </p>

        <div className="flex space-x-4 text-sm">
          <a href="#" className="hover:text-white transition">Privacy Policy</a>
          <a href="#" className="hover:text-white transition">Terms</a>
          <a href="#" className="hover:text-white transition">Support</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
