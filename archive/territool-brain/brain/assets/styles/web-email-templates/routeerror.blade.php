@extends('mails.layoutroute')
@section('body')

<tr>
	<td colspan="2">Dear {{ $demo->name }},</td>
</tr>
<tr>
	<td colspan="2">Error occurred during '{{ $demo->routename }}' route generation. Please try again after some time.</td>
</tr>
<tr>
	<td colspan="2" align="center">&nbsp;</td>
</tr>
            
@endsection