"use client";

import Card from "@/components/ui/Card";


type Props = {
  data: {

    technicalScore: number;

    newsScore: number;

    sentimentScore: number;

    fundamentalScore: number;

    macroScore: number;

    riskScore: number;

    totalScore: number;

  };
};


export default function AIConfidence({
  data,
}: Props) {


  const items = [

    {
      name: "Technical",
      value: data.technicalScore,
    },

    {
      name: "News",
      value: data.newsScore,
    },

    {
      name: "Sentiment",
      value: data.sentimentScore,
    },

    {
      name: "Fundamental",
      value: data.fundamentalScore,
    },

    {
      name: "Macro",
      value: data.macroScore,
    },

    {
      name: "Risk",
      value: data.riskScore,
    },

  ];


  return (

    <Card title="🧠 AI Confidence Breakdown">


      <div className="space-y-4">


        {
          items.map(
            (item)=>(
              
              <div key={item.name}>


                <div className="flex justify-between text-sm mb-1">

                  <span className="text-slate-300">
                    {item.name}
                  </span>


                  <span className="text-emerald-400">
                    {item.value}%
                  </span>


                </div>



                <div className="h-2 bg-slate-800 rounded">


                  <div

                    className="h-2 bg-emerald-500 rounded"

                    style={{
                      width:
                        `${item.value}%`,
                    }}

                  />


                </div>


              </div>

            )
          )
        }



        <div className="border-t border-slate-800 pt-4">


          <div className="flex justify-between">

            <span className="text-white font-bold">
              Final Score
            </span>


            <span className="text-2xl text-emerald-400 font-bold">

              {data.totalScore}%

            </span>


          </div>


        </div>


      </div>


    </Card>

  );

}
