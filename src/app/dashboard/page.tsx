"use client";

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex bg-[#f7ecd4]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#5a4634] text-[#f2e7c9] p-6 flex flex-col">
        <h2 className="text-2xl font-serif mb-8">📚 Dashboard</h2>

        <nav className="flex flex-col gap-4 text-lg">
          <a href="/dashboard" className="hover:text-[#d7b37d] transition">Overview</a>
          <a href="/shop" className="hover:text-[#d7b37d] transition">Manage Books</a>
          <a href="#" className="hover:text-[#d7b37d] transition">Orders</a>
          <a href="#" className="hover:text-[#d7b37d] transition">Users</a>
        </nav>

        <div className="mt-auto">
          <a 
            href="/" 
            className="mt-8 block text-center bg-[#d7b37d] text-[#4a3b2c] py-2 rounded font-semibold hover:bg-[#c7a065] transition"
          >
            ← Back to Landing
          </a>
        </div>
      </aside>

      {/* Main area */}
      <main className="flex-1 p-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-serif text-[#4a3b2c]">Admin Dashboard</h1>
          <button className="px-4 py-2 bg-[#5a4634] text-[#f2e7c9] rounded hover:bg-[#4b392a]">
            Add New Book
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          <div className="p-6 bg-white shadow-md rounded border border-[#d1b58a]">
            <h3 className="text-xl font-serif text-[#4a3b2c]">Total Books</h3>
            <p className="text-3xl mt-2 font-bold text-[#5a4634]">128</p>
          </div>
          <div className="p-6 bg-white shadow-md rounded border border-[#d1b58a]">
            <h3 className="text-xl font-serif text-[#4a3b2c]">Orders</h3>
            <p className="text-3xl mt-2 font-bold text-[#5a4634]">54</p>
          </div>
          <div className="p-6 bg-white shadow-md rounded border border-[#d1b58a]">
            <h3 className="text-xl font-serif text-[#4a3b2c]">Users</h3>
            <p className="text-3xl mt-2 font-bold text-[#5a4634]">212</p>
          </div>
        </div>

        {/* Books Table */}
        <div className="bg-white shadow-lg rounded border border-[#d1b58a] overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#e6d2ae] text-[#4a3b2c]">
              <tr>
                <th className="p-4 font-serif">Title</th>
                <th className="p-4 font-serif">Author</th>
                <th className="p-4 font-serif">Price</th>
                <th className="p-4 font-serif">Stock</th>
                <th className="p-4 font-serif">Actions</th>
              </tr>
            </thead>

            <tbody>
              {[
                { title: "The Great Gatsby", author: "F. Scott Fitzgerald", price: "$12.99", stock: 19 },
                { title: "1984", author: "George Orwell", price: "$10.49", stock: 32 },
                { title: "To Kill a Mockingbird", author: "Harper Lee", price: "$9.99", stock: 12 },
              ].map((book, index) => (
                <tr key={index} className="border-t border-[#d1b58a] hover:bg-[#faf4e5]">
                  <td className="p-4">{book.title}</td>
                  <td className="p-4">{book.author}</td>
                  <td className="p-4">{book.price}</td>
                  <td className="p-4">{book.stock}</td>
                  <td className="p-4">
                    <button className="mr-3 text-blue-700 hover:underline">Edit</button>
                    <button className="text-red-700 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </main>
    </div>
  );
}
