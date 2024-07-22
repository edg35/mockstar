function DashboardLayout({ children }) {
  return (
    <div className="flex">
      <div className="flex-grow mx-5 md:mx-5 lg:mx-5">{children}</div>
    </div>
  );
}

export default DashboardLayout;
