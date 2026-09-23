@extends('mails.layout')
@section('body')

<tr>
	<td colspan="2">Dear Admin,</td>
</tr>
<tr>
	<td colspan="2">Subscription has been cancelled by {{ $demo->salesperson }} and his/her email id is {{ $demo->email }}</td>
</tr>
<tr>
	<td colspan="2" align="center">&nbsp;</td>
</tr>
            
@endsection