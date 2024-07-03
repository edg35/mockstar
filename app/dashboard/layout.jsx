import SideBar from "./_components/SideBar"

function DashboardLayout({children}) {
  return (
    <div className="flex">
      <SideBar />  {/* Add the SideBar component here */}
      <div className="flex-grow mx-5 md:mx-5 lg:mx-5">
        {children}
      </div>
    </div>
  )
}

export default DashboardLayout
