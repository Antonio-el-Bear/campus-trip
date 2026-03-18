import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, MapPin, FileText } from 'lucide-react';
import { type Member } from '@/lib/mockData';

interface AuthorLeaderboardListProps {
  members: Member[];
}

const AuthorLeaderboardList = ({ members }: AuthorLeaderboardListProps) => {
  if (members.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground font-body">
          No authors match the selected filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {members.map((member, index) => {
        const rank = index + 1;
        const isTop3 = rank <= 3;
        const medalColors = [
          'text-accent bg-accent/10 border-accent/30',
          'text-muted-foreground bg-secondary border-border',
          'text-orange-700 bg-orange-50 border-orange-200',
        ];

        return (
          <Link
            key={member.id}
            to={`/member/${member.id}`}
            className="block group"
          >
            <Card
              className={`transition-all duration-200 hover:shadow-md ${isTop3 ? 'border-accent/20' : ''}`}
            >
              <CardContent className="flex items-center gap-4 p-4">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border text-sm font-display font-bold shrink-0 ${
                    isTop3
                      ? medalColors[rank - 1]
                      : 'text-muted-foreground bg-secondary/50 border-border'
                  }`}
                >
                  {isTop3 ? <Trophy className="h-4 w-4" /> : rank}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-semibold text-sm text-foreground truncate group-hover:text-accent transition-colors">
                    {member.fullName}
                  </h3>
                  <p className="text-xs text-muted-foreground font-body mt-0.5 line-clamp-1">
                    {member.description}
                  </p>
                  <div className="flex gap-1.5 mt-1.5 flex-wrap">
                    {member.countriesVisited.slice(0, 3).map((c) => (
                      <Badge
                        key={c}
                        variant="outline"
                        className="text-[10px] px-1.5 py-0"
                      >
                        {c}
                      </Badge>
                    ))}
                    {member.countriesVisited.length > 3 && (
                      <Badge
                        variant="outline"
                        className="text-[10px] px-1.5 py-0"
                      >
                        +{member.countriesVisited.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0 text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5" />
                    <span className="font-display font-semibold text-sm">
                      {member.tripCount}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="font-body text-xs">
                      {member.countriesVisited.length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
};

export default AuthorLeaderboardList;
