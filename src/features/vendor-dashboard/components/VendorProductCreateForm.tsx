interface VendorProductCreateFormProps {
  name: string
  price: string
  description: string
  categoryId: string
  categories: Array<{ id: string; name: string }>
  createError: string | null
  creating: boolean
  onNameChange: (v: string) => void
  onPriceChange: (v: string) => void
  onDescriptionChange: (v: string) => void
  onCategoryChange: (v: string) => void
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
}

export function VendorProductCreateForm({
  name,
  price,
  description,
  categoryId,
  categories,
  createError,
  creating,
  onNameChange,
  onPriceChange,
  onDescriptionChange,
  onCategoryChange,
  onSubmit,
  onCancel,
}: VendorProductCreateFormProps) {
  return (
    <form
      className="mb-5 grid gap-2 border border-line p-4 sm:grid-cols-2"
      onSubmit={onSubmit}
    >
      <input
        className="border border-line px-3 py-2"
        placeholder="Product name"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        required
      />
      <input
        className="border border-line px-3 py-2"
        placeholder="Price"
        type="number"
        min="1"
        step="0.01"
        value={price}
        onChange={(e) => onPriceChange(e.target.value)}
        required
      />
      <select
        className="border border-line px-3 py-2"
        value={categoryId}
        onChange={(e) => onCategoryChange(e.target.value)}
        required
      >
        <option value="">Select category</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
      <input
        className="border border-line px-3 py-2"
        placeholder="Short description"
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
      />
      <div className="flex gap-2 sm:col-span-2">
        <button
          className="bg-brand px-4 py-2 text-paper disabled:opacity-50"
          type="submit"
          disabled={creating}
        >
          {creating ? 'Creating…' : 'Create product'}
        </button>
        <button className="border border-line px-4 py-2" type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
      {createError && <p className="text-sm text-red-600 sm:col-span-2">{createError}</p>}
    </form>
  )
}
