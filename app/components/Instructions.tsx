export default function Instructions() {
    return (
        <div className="w-full max-w-2xl mx-auto mb-6 px-4 py-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg flex flex-col items-start md:items-center gap-2">
            <h2 className="text-lg md:text-xl font-semibold text-blue-700 mb-2 tracking-tight">
                👋 How to Use roaster.ai
            </h2>
            <ul className="text-sm md:text-base text-gray-800 pl-5 list-disc space-y-1">
                <li>
                    <span className="font-medium">Select two images</span> (e.g., of friends, celebrities, or anything you want roasted).
                </li>
                <li>
                    <span className="font-medium">Click <b>Generate Roast</b></span> to let AI compare and craft a fun roast between them.
                </li>
                <li>
                    <span className="font-medium">Wait a moment</span> for the magic to happen. Your AI roast will appear below!
                </li>
                <li>
                    <span className="font-medium text-blue-600">Important: </span> 
                    <span>
                        Please make sure your images clearly feature a person—otherwise, our AI can't roast them!
                    </span>
                </li>
            </ul>
            <p className="text-xs text-gray-500 mt-3">
                <b>Note:</b> Please use appropriate images. This is all in good fun!
            </p>
        </div>
    )
}