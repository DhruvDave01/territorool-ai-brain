@extends('mails.layout')
@section('body')

<tr>
	<td colspan="2">Dear Admin,</td>
</tr>
<tr>
    <td colspan="2">User {{ $demo->salesperson }} ({{ $demo->email }}) has requested to cancel their subscription; please process the cancellation in RevCat.</td>
</tr>
<tr>
	<td colspan="2" align="center">&nbsp;</td>
</tr>
            
@endsection