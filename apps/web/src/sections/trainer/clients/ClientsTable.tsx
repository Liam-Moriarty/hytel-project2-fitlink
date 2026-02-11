import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { removeTraineeFromTrainer } from '@/lib/api/trainer'
import { toast } from 'sonner'
import { Trash2, Users } from 'lucide-react'
import { getAvatarColor } from '@/constants'
import { ClientsTableProps } from '@/interface'

const ClientsTable = ({ clients, trainerId, isLoading }: ClientsTableProps) => {
  const queryClient = useQueryClient()
  const [clientToRemove, setClientToRemove] = useState<{
    uid: string
    name: string | null
  } | null>(null)

  const { mutate: removeClient, isPending } = useMutation({
    mutationFn: (traineeId: string) => removeTraineeFromTrainer(trainerId, traineeId),
    onSuccess: () => {
      toast.success('Client removed successfully')
      setClientToRemove(null)
      queryClient.invalidateQueries({ queryKey: ['trainerProfile', trainerId] })
      queryClient.invalidateQueries({ queryKey: ['trainerClients'] })
    },
    onError: () => {
      toast.error('Failed to remove client')
    },
  })

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Client List</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Client List</CardTitle>
      </CardHeader>
      <CardContent>
        {clients.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted/50 mb-4">
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium">No clients yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Invite trainees using the form above to get started
            </p>
          </div>
        ) : (
          <AlertDialog>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map(client => {
                  const avatarColor = getAvatarColor(client.email || '')
                  const initial = (
                    client.displayName?.[0] ||
                    client.email?.[0] ||
                    '?'
                  ).toUpperCase()

                  return (
                    <TableRow key={client.uid}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${avatarColor.bg} ${avatarColor.text}`}
                          >
                            {initial}
                          </div>
                          <span className="font-medium">{client.displayName || 'Unknown'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{client.email}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">Active</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              setClientToRemove({
                                uid: client.uid,
                                name: client.displayName,
                              })
                            }
                            disabled={isPending}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remove Client</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to remove{' '}
                  <span className="font-semibold text-foreground">
                    {clientToRemove?.name || 'this client'}
                  </span>{' '}
                  from your client list? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setClientToRemove(null)}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    if (clientToRemove) removeClient(clientToRemove.uid)
                  }}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Remove
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardContent>
    </Card>
  )
}

export default ClientsTable
