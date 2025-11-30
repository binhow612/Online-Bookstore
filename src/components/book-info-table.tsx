export function BookInfoTable({
  book,
}: {
  book: {
    publisher?: string | null;
    author?: string | null;
    year?: number | null;
    isbn?: string | null;
    pages?: number | null;
    language?: string | null;
    category?: string | null;
  };
}) {
  const rows = [
    { label: "Author", value: book.author },
    { label: "Publisher", value: book.publisher },
    { label: "Year", value: book.year },
    { label: "ISBN", value: book.isbn },
    { label: "Pages", value: book.pages },
    { label: "Language", value: book.language },
    { label: "Category", value: book.category },
  ].filter((row) => row.value != null);

  return (
    <div className="border rounded-lg overflow-hidden w-full mt-4">
      <table className="w-full text-sm">
        <tbody>
          {rows.map((row, idx) => (
            <tr
              key={idx}
              className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
            >
              <td className="px-4 py-2 font-medium w-40 border-r">
                {row.label}
              </td>
              <td className="px-4 py-2">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
