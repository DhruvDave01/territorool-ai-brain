@extends('mails.layoutroute')
@section('body')
<tr>
	<td colspan="2">Dear Admin,</td>
</tr>

<tr>
	<td>Here is the list of users whose free trail has been expired in last 24 hours</td>
</tr>

<table style="border:1px solid black;width:100%;border-spacing: unset;">
<thead>
	<tr>
		<th style="border-right:1px solid black;font-weight:700;padding: 5px 10px;">Name</th>
		<th style="font-weight:700;padding: 5px 10px;">Email</th>
	</tr>
</thead>
<tbody>
@foreach($userdata as $user)
	<tr>
		<td style="border-right:1px solid black;border-top:1px solid black;padding: 5px 10px;">{{$user['name']}}</td>
		<td style="border-top:1px solid black;padding: 5px 10px;">{{$user['email']}}</td>
	</tr>
@endforeach
</tbody>
        	
</table>    
@endsection