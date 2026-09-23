@extends('mails.layout')
@section('body')

<tr>
	<td colspan="2">Dear Admin,</td>
</tr>
<tr>
	<td colspan="2">Subscription has been cancelled by {{ $demo->salesperson }} and below is the reason of it.</td>
</tr>
<tr>
	<td colspan="2"><b>Reason:</b> {{ $demo->message }}</td>
</tr>
<tr>
	<td colspan="2" align="center">&nbsp;</td>
</tr>
            
@endsection