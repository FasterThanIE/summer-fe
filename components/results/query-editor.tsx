export function QueryEditor({ value }: { value: string }) {
  return (
    <form className="fgroup prompt-edit">
      <label className="prompt-edit__label" htmlFor="f-q">
        Tvoj upit
      </label>
      <textarea id="f-q" name="q" rows={4} defaultValue={value} />
      <button className="prompt-edit__btn" type="submit">
        Primeni izmene <span aria-hidden="true">&rarr;</span>
      </button>
    </form>
  );
}
