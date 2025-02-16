export default function login() {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-black text-white text-center px-4">

        <form className="flex flex-col w-full max-w-sm">
          <input
            className="p-3 mb-4 w-full text-black rounded-md"
          />
          <input
            type="password"
            className="p-3 mb-4 w-full text-black rounded-md"
          />
        </form>

      </div>
    );
  }
  