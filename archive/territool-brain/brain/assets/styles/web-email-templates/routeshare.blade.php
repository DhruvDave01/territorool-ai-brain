@extends('mails.layout')
@section('body')

<tr>
	<td colspan="2">Dear {{ $demo->userName }},</td>
</tr>
<tr>
	<td colspan="2">{{ $demo->sharedby }} sent you a route named {{ $demo->route->title }} on TerriTool. </td>
</tr>
<tr>
	<td colspan="2"> <a href="https://apps.apple.com/lu/app/territool-app/id1399506362" target="_blank">Click here</a>  to view on Mobile</td>
</tr>
<tr>
	<td colspan="2"> <a href="{{ config('app.url') }}route/view/{{$demo->route->id}}" target="_blank">Click here</a>  to view on Web </td>
</tr>
<tr>
	<td colspan="2" align="center">&nbsp;</td>
</tr>

</table>       
@endsection