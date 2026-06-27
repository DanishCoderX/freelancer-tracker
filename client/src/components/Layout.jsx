import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Navbar />
      {/* Desktop: offset for sidebar. Mobile: offset for top bar */}
      <main className="flex-1 lg:ml-56 pt-16 lg:pt-0 p-4 lg:p-8 min-h-screen">
        {children}
      </main>
    </div>
  );
}
