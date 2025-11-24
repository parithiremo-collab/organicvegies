import { Card } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface AnalyticsCardProps {
  title: string;
  data: any[];
  type?: "bar" | "line";
  dataKey: string;
  xKey: string;
}

export default function AnalyticsCard({
  title,
  data,
  type = "bar",
  dataKey,
  xKey,
}: AnalyticsCardProps) {
  return (
    <Card className="p-5" data-testid={`card-analytics-${title.toLowerCase()}`}>
      <h3 className="font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={200}>
        {type === "bar" ? (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip />
            <Bar dataKey={dataKey} fill="#8b5cf6" />
          </BarChart>
        ) : (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey={dataKey} stroke="#8b5cf6" />
          </LineChart>
        )}
      </ResponsiveContainer>
    </Card>
  );
}
