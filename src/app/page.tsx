export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f7f2e8] flex flex-col items-center justify-center px-6">

      {/* Decorative frame */}
      <div className="w-full max-w-4xl border-4 border-[#8b6b3f] rounded-xl p-12 shadow-[0_0_30px_rgba(0,0,0,0.25)] bg-[#fcf9f3]">

        {/* Title */}
        <h1 className="text-center text-5xl font-serif font-bold text-[#6b4e2e] tracking-wide">
          The Old Library Bookstore
        </h1>

        {/* Slogan */}
        <p className="text-center text-xl mt-4 font-light italic text-[#8b6b3f]">
          “Where every story finds its reader.”
        </p>

        {/* Divider */}
        <div className="mt-8 w-full border-t border-[#c9b49a]"></div>

        {/* About */}
        <div className="mt-8 text-center text-lg text-[#6a563d] leading-relaxed font-serif">
          Welcome to our classic-themed online bookstore — a place where
          timeless stories meet modern convenience.  
          Explore thousands of books, curated collections, author highlights,
          and personalized recommendations.  
          Step into a world crafted for readers, by readers.
        </div>

        {/* Button */}
        <div className="flex justify-center mt-12">
          <a
            href="/home"
            className="px-10 py-4 bg-[#8b6b3f] hover:bg-[#6b4e2e] transition text-[#fcf9f3] text-xl font-semibold rounded-lg shadow-lg"
          >
            Enter Home
          </a>
        </div>

      </div>

      {/* Footer */}
      <p className="mt-10 text-sm text-[#8b6b3f] opacity-70">
        © 2025 The Old Library Bookstore
      </p>
    </div>
  );
}
