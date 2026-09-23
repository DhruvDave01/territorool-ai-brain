@extends('mails.layoutroute')
@section('body')
<tr>
	<td colspan="2">Dear Admin,</td>
</tr>

<tr>
	<td colspan="2">A new user registered on {{$demo->domain}}. Call in 2-3 business days.</td>
</tr>

<tr>
	<td style="color: #666666; padding: 10px; font-weight: bold; line-height: 20px;padding-bottom:0px">Name:</td>
	<td>{{ $demo->name }}</td>
</tr>
<tr>
	<td style="color: #666666; padding: 10px; font-weight: bold; line-height: 20px;padding-bottom:0px">Email:</td>
	<td>{{ $demo->email }}</td>
</tr>
<tr>
	<td style="color: #666666; padding: 10px; font-weight: bold; line-height: 20px;padding-bottom:0px">Phone Number:</td>
	<td>{{ $demo->phone }}</td>
</tr>
<tr>
	<td style="color: #666666; padding: 10px; font-weight: bold; line-height: 20px;padding-bottom:0px">Platform:</td>
	<td>{{ $demo->domain }}</td>
</tr>
        	
</table>    
@endsection