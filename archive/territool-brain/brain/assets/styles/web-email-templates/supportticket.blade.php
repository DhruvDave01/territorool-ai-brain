@extends('mails.layout')
@section('body')

<tr>
	<td colspan="2">Dear Admin,</td>
</tr>
<tr>
	<td colspan="2">New support ticket has been created by {{ $demo->salesperson }}, Click below button to view the ticket detail. </td>
</tr>
<tr>
	<td>Description: </td>
	<td>{{ $demo->description }} </td>
</tr>
<tr>
	<td colspan="2" align="center"><a href="{{ URL::to('/') }}/admin/support/view/{{ $demo->id }}" style=" background:#139186; padding: 10px 15px; font-size: 14px; font-weight: bold; border-radius: 10px; color: #ffffff; text-decoration: none; ">View Ticket</a>
	</td>
</tr>
<tr>
	<td colspan="2" align="center">&nbsp;</td>
</tr>
            
@endsection