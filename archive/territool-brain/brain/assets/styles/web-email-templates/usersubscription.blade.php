@extends('mails.layout')
@section('body')

<tr>
	<td colspan="2">Dear Admin,</td>
</tr>
<tr>
	<td colspan="2">We have a new subscription in our system.</td>
</tr>
<tr>
	<td colspan="2">{{$user->name}} has subscribed to the following package:</td>
</tr>

<tr>
	<td>Package Name:</td>
	<td>{{ $package->title }}</td>
</tr>
<tr>
	<td>Amount:</td>
	<td>${{ $subscription->amount }}</td>
</tr>	

</table>         
@endsection