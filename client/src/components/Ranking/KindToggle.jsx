const KIND_OPTIONS = ['라방', '홈쇼핑'];

export default function KindToggle({ value, onChange }) {
  return (
    <div className="kind-toggle" role="tablist" aria-label="방송 유형">
      {KIND_OPTIONS.map((kind) => (
        <button
          key={kind}
          type="button"
          role="tab"
          aria-selected={value === kind}
          className={`kind-toggle__button ${value === kind ? 'is-active' : ''}`}
          onClick={() => onChange(kind)}
        >
          {kind}
        </button>
      ))}
    </div>
  );
}
