@extends('mails.layout')
@section('body')

<tr>
	<td colspan="2">Dear Admin,</td>
</tr>
<tr>
	<td colspan="2">A user has requested to upgrade their package via the app.</td>
</tr>
<tr>
	<td colspan="2">&nbsp;</td>
</tr>
<tr>
	<td>User ID:</td>
	<td>{{ $user->id }}</td>
</tr>
<tr>
	<td>Name:</td>
	<td>{{ $user->name }}</td>
</tr>
<tr>
	<td>Email:</td>
	<td>{{ $user->email }}</td>
</tr>
@if (!empty($user->phone))
<tr>
	<td>Phone:</td>
	<td>{{ $user->phone }}</td>
</tr>
@endif
@if ($currentPackage)
<tr>
	<td>Current package:</td>
	<td>{{ $currentPackage->title }} (ID {{ $currentPackage->id }})</td>
</tr>
@else
<tr>
	<td>Current package:</td>
	<td>No active subscription found</td>
</tr>
@endif
@if ($subscription)
<tr>
	<td>Subscription status:</td>
	<td>{{ $subscription->status }}</td>
</tr>
@endif


</table>
@endsection
