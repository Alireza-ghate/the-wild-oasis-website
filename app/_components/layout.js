export default function Layout({ children }) {
  return (
    <div className="grid grid-cols-[16rem_1fr] h-full gap-12">
      <div>navigation</div>
      <div className="py-1">{children}</div>
    </div>
  );
}
