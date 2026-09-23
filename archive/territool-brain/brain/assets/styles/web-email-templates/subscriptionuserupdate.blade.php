@extends('mails.layout')
@section('body')

<tr>
	<td colspan="2">Dear Admin,</td>
</tr>
<tr>
	<td colspan="2">Here is the Registered users detail:</td>
</tr>
<tr>
	<td>Total Number of Paid Users:</td>
	<td>{{ $demo->paidUsersCount }}</td>
</tr>
<tr>
	<td>Total Number of Active Trials:</td>
	<td>{{ $demo->activeTrialUsersCount }}</td>
</tr>
<tr>
	<td>Total Number of Expired Trials :</td>
	<td>{{ $demo->expiredTrialUsersCount }}</td>
</tr>
<tr>
	<td>New Paid Users:</td>
	<td>{{ $demo->newPaidUsersCount }}</td>
</tr>
<tr>
	<td>New Active Trials:</td>
	<td>{{ $demo->newActiveTrialUsersCount }}</td>
</tr>
<tr>
	<td>New Expired Trials:</td>
	<td>{{ $demo->newExpiredTrialUsersCount }}</td>
</tr>
</table>         
@endsection