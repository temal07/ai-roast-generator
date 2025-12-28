export default function Footer() {
  return (
    <footer className="w-full mt-12 mb-4 flex flex-col items-center text-center text-xs text-gray-500">
      <hr className="w-full max-w-2xl border-t border-gray-200 mb-3" />
      <span>
        &copy; {new Date().getFullYear()} roaster.ai &mdash; For fun, not harm. 
      </span>
      <span>
        Made with{" "}
        <span className="inline-block align-middle" aria-label="Gemini logo">
          <img
            src="/gemini-icon.webp"
            alt="Gemini logo"
            className="w-4 h-4 inline-block mx-1"
            style={{ display: "inline", verticalAlign: "middle" }}
          />
        </span>{" "}
        | © {new Date().getFullYear()} A roaster.ai production. All rights reserved.
      </span>
    </footer>
  );
}
