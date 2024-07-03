import Image from "next/image";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-white">
        <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
          <aside className="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6">
            <Image
              alt="careerprogresspic"
              src={"/careerprogress.svg"}
              height={100}
              width={100}
              className="absolute inset-0 h-full w-full object-fit xs:object-cover"
            />
          </aside>

          <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
            <div className="max-w-xl lg:max-w-3xl">
              <h1 className="mt-6 text-3xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
                Get Hired Faster with AI-Powered Job Search Tools.
              </h1>

              <p className="mt-4 leading-relaxed text-gray-500">
                Craft a Winning Resume & Cover Letter in Minutes. Master Your
                Interview Skills with AI Coaching.
              </p>
            </div>
          </main>
        </div>
      </section>
    </>
  );
}
