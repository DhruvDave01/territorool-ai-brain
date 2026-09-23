@extends('mails.layout')
@section('body')

<tr>
	<td colspan="2">Dear Admin,</td>
</tr>
<tr>
	<td colspan="2">Here is the OpenCorporates API usage:</td>
</tr>
<tr>
	<td>Todays Usage:</td>
	<td>{{ $demo->daily_usage }}</td>
</tr>
<tr>
	<td>Todays Remaining Calls:</td>
	<td>{{ $demo->daily_total }}</td>
</tr>
<tr>
	<td>This Month Usage:</td>
	<td>{{ $demo->monthly_usage }}</td>
</tr>
<tr>
	<td>This Month Remaining Calls:</td>
	<td>{{ $demo->monthly_total }}</td>
</tr>
</table>         
@endsection