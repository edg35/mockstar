import { Lightbulb } from "lucide-react"

function QuestionSection({mockInterviewQuestion, activeQuestion}) {
  return mockInterviewQuestion&&(
    <div className="p-5 border rounded-lg my-10">
        <div className="grid grid-cols-2: md:grid-cols-3 lg:grid-cols-4 gap-5">
            {mockInterviewQuestion&&mockInterviewQuestion.map((question, index) => (
                <h2 
                    key={index} 
                    className={`p-2 bg-secondary rounded-full text-xs md:text-sm text-center cursor-pointer
                        ${activeQuestion == index&&'bg-slate-500 text-white'}`}
                >
                    Question #{index+1}
                </h2>
            ))}
        </div>
        <h2 className="my-5 text-md md:text-lg">{mockInterviewQuestion[activeQuestion]?.question}</h2>
        <div className="border rounded-lg p-5 bg-blue-100 mt-20">
            <h2 className="flex gap-2 items-center">
                <Lightbulb />
                <strong>Note:</strong>
            </h2>
            <h2 className="text-sm my-2">
                Click on record answer when you want to answer the question. At the end of the 
                interview we will give you the feedback along with the correct answer for each 
                question and your answer to compare it to.
            </h2>
        </div>
    </div>
  )
}

export default QuestionSection
