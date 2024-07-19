'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import Link from "next/link"
import moment from 'moment';
import { IApplication } from "@/convex/applications";

interface ApplicationCardProps {
    apps: IApplication[];
    lng: string;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({ apps, lng}) => {
    const applicationUrl = "/dashboard/application/";
    return (
        <>
            { apps.map((app, index) => (
                <Link key={index} href={applicationUrl + app._id }>
                    <Card>
                    <CardHeader className="grid grid-cols-[1fr_110px] items-start gap-4 space-y-0">
                        <div className="space-y-1">
                            <CardTitle>{ app.name }</CardTitle>
                            <CardDescription>
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex space-x-4 text-sm text-muted-foreground">
                            <div>Updated { moment(new Date(app.editionTime)).fromNow() }</div>
                        </div>
                    </CardContent>
                    </Card>
                </Link>

            ))}
        </>
    )
}