@extends('mails.layoutroute')
@section('body')
<tr>
	<td colspan="2">Hi {{$demo->name}},</td>
</tr>
<tr>
    <td colspan="2">Thank you for subscribing as a Business Client to TerriTool.</td>
</tr>
<tr>
    <td colspan="2">Here is the billing information and invoice link.</td>
</tr>
<tr>
	<td style="color: #666666; padding: 10px; font-weight: bold; line-height: 20px;">Name:</td>
	<td>{{ $demo->name }}</td>
</tr>
<tr>
	<td style="color: #666666; padding: 10px; font-weight: bold; line-height: 20px;">Email:</td>
	<td>{{ $demo->email }}</td>
</tr>
<tr>
	<td style="color: #666666; padding: 10px; font-weight: bold; line-height: 20px;">Address:</td>
	<td>{{ $demo->address }}</td>
</tr>
<tr>
	<td style="color: #666666; padding: 10px; font-weight: bold; line-height: 20px;">Company Name:</td>
	<td>{{ $demo->company_name }}</td>
</tr>
<tr>
	<td style="color: #666666; padding: 10px; font-weight: bold; line-height: 20px;">Number Of License(s):</td>
	<td>{{ $demo->amount_of_licenses }}</td>
</tr>
<tr>
	<td style="color: #666666; padding: 10px; font-weight: bold; line-height: 20px;">Cost Per User:</td>
	<td>${{ $demo->cost_per_user }}</td>
</tr>
<tr>
	<td style="color: #666666; padding: 10px; font-weight: bold; line-height: 20px;">Total Cost:</td>
	<td>${{ $demo->cost_per_user * $demo->amount_of_licenses }}</td>
</tr>
<tr>
	<td style="color: #666666; padding: 10px; font-weight: bold; line-height: 20px;">Payment Frequency:</td>
	<td>{{ $demo->payment_period }}</td>
</tr>
<tr>
	<td style="color: #666666; padding: 10px; font-weight: bold; line-height: 20px;">Download Invoice:</td>
	<td><a href="{{ $demo->invoice_link }}" target="_blank">Download</a></td>
</tr>
        	
</table> 
@endsection